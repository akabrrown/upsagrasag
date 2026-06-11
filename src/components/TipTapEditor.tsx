// components/TipTapEditor.tsx
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { z } from 'zod';

export interface TipTapEditorProps {
  /** Initial JSON content */
  content?: any;
  /** Called with JSON when content changes */
  onChange?: (content: any) => void;
  /** Optional placeholder text */
  placeholder?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content = { type: 'doc', content: [] },
  onChange,
  placeholder = 'Start typing…',
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content,
    onUpdate({ editor }) {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none max-w-full',
        spellcheck: 'false',
      },
    },
  });

  // Ensure placeholder works on empty content
  useEffect(() => {
    if (editor && editor.isEmpty) {
      editor.commands.setContent({
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }],
      });
    }
  }, [editor]);

  return <EditorContent editor={editor} />;
};
