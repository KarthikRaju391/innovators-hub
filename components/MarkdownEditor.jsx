// import react, react-markdown-editor-lite, and a markdown parser you like
import React from 'react';
// import * as ReactDOM from 'react-dom';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt(/* Markdown-it options */);

const MarkdownEditor = ({ value, onChange, name, id, placeholder }) => {
  const handleEditorChange = ({ text }) => {
    onChange(text);
  };

  return (
    <MdEditor value={value}
    onChange={handleEditorChange}
    name={name}
    id={id}
    placeholder={placeholder} 
    renderHTML={text => mdParser.render(text)} />
  );
};

export default MarkdownEditor;
{/* <ReactMarkdownEditorLite
      value={value}
      onChange={handleEditorChange}
      name={name}
      id={id}
      placeholder={placeholder}
    /> */}