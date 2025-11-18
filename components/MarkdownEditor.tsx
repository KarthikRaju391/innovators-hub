import React from 'react';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const handleEditorChange = (val?: string) => {
    onChange(val || '');
  };

  return (
    <MDEditor
      value={value}
      onChange={handleEditorChange}
      preview="edit"
      hideToolbar={false}
      visibleDragbar={false}
      data-color-mode="light"
    />
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