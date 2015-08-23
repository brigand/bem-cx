import fs from 'fs';
import {resolve} from 'path';

fs.readdir('src', (err, files) => {
  const sourceFiles = files
  .filter((x) => /\.js$/.test(x))

  sourceFiles.forEach((sourceFile) => {
    const sourceFilePath = resolve('src', sourceFile);
    fs.readFile(sourceFilePath, 'utf8', (err, content) => {
      const outPath = resolve('docs', sourceFile.replace(/\.js$/, '.md'));
      console.log('Generating docs for ' + sourceFile);

      const md = codeToMarkdown(content);
      fs.writeFile(outPath, md, 'utf8');
      console.log('Writing to ' + outPath);
    });
  });
});

function codeToMarkdown(code){
  const lines = code.split('\n');

  const getModeState = () => ({buffer: ''})

  const state = {
    line: 0,
    mode: 'CODE', // or COMMENT,
    output: [],
    modeState: getModeState()
  };

  while (state.line < lines.length) {
    const initialMode = state.mode;
    const line = lines[state.line];

    const info = {line, trimmedLine: line.trim()};

    if (state.mode === 'CODE') {
      processCode(state, info)
    }
    else if (state.mode === 'COMMENT') {
      processComment(state, info);
    }

    // mode changed?
    if (state.mode !== initialMode) {
      state.modeState = getModeState();
    }

    state.lastMode = initialMode;
    state.line++;
  }

  const result = state.output.join('\n\n');
  return result;
}

function processCode(state, {line, trimmedLine}){
  if (trimmedLine.slice(0, 5) === 'class') {
    state.output.push('## ' + line);
  }

  // check if we should prepend the current line to the last chunk
  // typically the function signature
  if (state.lastMode === 'COMMENT') {
    console.error('::: ' + line);
    const chunk = state.output[state.output.length];

    // make the header
    const indent = getIndent(line);
    const headerLevel = Math.floor(indent / 2) + 2;
    let header = '';
    while(header.length < headerLevel) header += '#';

    header += ' ';
    if (headerLevel === 3) {
      header += '`';
      header += '.';
      header += trimmedLine.replace(/\{$/, '')
      header += '`';
    }
    else {
      header += trimmedLine.replace(/\{$/, '');
    }

    // insert it as the item before last
    state.output.splice(state.output.length - 1, 0, header);
    return;
  }

  if (trimmedLine.slice(0, 3) === '/**') {
    state.mode = 'COMMENT';
    if (trimmedLine.length > 3) {
      // unpush the line
      state.line--;
    }
    return;
  }
}

function processComment(state, {line, trimmedLine}){
  const hasOpeningComment = trimmedLine.indexOf('/**') !== -1;
  const hasClosingComment = trimmedLine.indexOf('**/') !== -1;

  // single line comment ?
  if (hasOpeningComment && hasClosingComment) {
    const body = trimmedLine.replace('/**', '').replace('**/', '').trim();
    state.output.push(body);
    state.mode = 'CODE';
    return;
  }

  // end of comment?
  if (hasClosingComment) {
    state.output.push(toBaseIndent(state.modeState.buffer));
    state.mode = 'CODE';
    return;
  }

  if (!hasOpeningComment && !hasClosingComment) {
    state.modeState.buffer += line + '\n';
  }
}

function getIndent(text){
  let i=0;
  while(text[i] === ' ') i++;
  return i;
}

function getBaseIndent(lines){
  return lines.reduce((min, line) => {
    if (line.trim().length === 0) return min;
    return Math.min(min, getIndent(line));
  }, Infinity);
}

function toBaseIndent(text){
  const lines = text.split('\n');
  const baseIndent = getBaseIndent(lines);
  return lines.map((line) => {
    return line.slice(baseIndent);
  }).join('\n');
}
