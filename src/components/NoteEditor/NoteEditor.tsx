import React, { useEffect, useRef, useCallback } from "react";
import ReactQuill, { Quill } from "react-quill";
import BlotFormatter from "quill-blot-formatter";

import "react-quill/dist/quill.snow.css";

const modules = {
  blotFormatter: {},
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: ["small", false, "large", "huge"] }],
      ["link", "image"],
      [{ color: [] }, { background: [] }],
    ],
    handlers: {
      image: function () {},
    },
  },
};

Quill.register("modules/blotFormatter", BlotFormatter);

interface NoteEditorProps {
  notes: string;
  onNotesChange: (content: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ notes, onNotesChange }) => {
  const quillRef = useRef<ReactQuill>(null);

  const insertToEditor = useCallback(
    (url: string) => {
      const editor = quillRef.current!.getEditor();
      const range = editor.getSelection();
      editor.insertEmbed(range!.index, "image", url);
    },
    [quillRef],
  );

  const selectLocalImage = useCallback(() => {
    const url = window.prompt("Enter image URL");
    if (url) {
      insertToEditor(url);
    }
  }, [insertToEditor]);

  useEffect(() => {
    if (quillRef.current) {
      let quill = quillRef.current.getEditor();
      quill.getModule("toolbar").addHandler("image", selectLocalImage);
    }
  }, [quillRef, selectLocalImage]);

  return (
    <ReactQuill style={{ height: "100%" }} ref={quillRef} modules={modules} value={notes} onChange={onNotesChange} />
  );
};

export default NoteEditor;
