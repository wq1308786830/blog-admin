import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import MonacoEditor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { FileText, Code } from 'lucide-react';
import config from '@/helpers/config';
import { useCategories } from '@/hooks/useCategories';
import { useArticleEdit } from '@/hooks/useArticleEdit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader } from '@/components/ui/loader';
import { CascaderSelect } from '@/components/form/CascaderSelect';
import type { CategoryOption } from '@/types';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.scss';

function Index() {
  const { articleId, categoryId } = useParams();
  const navigate = useNavigate();
  const { data: categoryOptions = [] } = useCategories();

  const numArticleId = articleId ? parseInt(articleId, 10) : undefined;
  const {
    state,
    updateState,
    publishArticle,
    isLoading: articleLoading,
    isPublishing,
  } = useArticleEdit(numArticleId);

  const [category, setCategory] = useState<(string | number)[]>([]);
  const [editor, setEditor] = useState<any>(null);

  /**
   * 在选项树中查找对应节点的完整路径
   */
  const findCategoryPath = (
    options: CategoryOption[],
    targetId: number,
    path: any[] = []
  ): any[] | null => {

    for (const option of options) {
      const currentPath = [...path, option];
      if (option.value === targetId) {
        return currentPath;
      }
      if (option.children && option.children.length > 0) {
        const result = findCategoryPath(option.children, targetId, currentPath);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  // Sync category when article data loads or when categoryId from URL changes
  useEffect(() => {
    if (state.categoryId) {
      const categoryPath = findCategoryPath(categoryOptions, state.categoryId);
      setCategory(categoryPath ? categoryPath.map(c => c.value) : []);
    } else if (categoryId) {
      const categoryIdNum = parseInt(categoryId, 10);
      const categoryPath = findCategoryPath(categoryOptions, categoryIdNum);
      setCategory(categoryPath ? categoryPath.map(c => c.value) : []);
    }
  }, [state.categoryId, categoryId, categoryOptions]);

  const onCascaderChange = (value: (string | number)[]) => {
    setCategory(value);
  };

  const onEditorStateChange = (newEditorState: any) => {
    updateState({ editorState: newEditorState });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ title: e.target.value });
  };

  const onClickPublish = () => {
    const categoryIdValue = category.length > 0 ? Number(category[category.length - 1]) : 0;
    updateState({ categoryId: categoryIdValue });

    const additionalData: { id?: number } = {};
    if (numArticleId && numArticleId !== 0) {
      additionalData.id = numArticleId;
    }

    publishArticle(additionalData);

    // Navigate after a short delay to allow mutation to complete
    setTimeout(() => {
      navigate('/articleListManage');
    }, 500);
  };

  const onEditorChange = (newValue: string | undefined) => {
    updateState({ markdownContent: newValue || '' });
  };

  const uploadImageCallBack = (file: any) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${config.prefix}/manage/uploadBlgImg`);
      xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });

  const updateDimensions = () => {
    if (editor) {
      editor.layout();
    }
  };

  const editorDidMount = (monacoEditor: any) => {
    window.addEventListener('resize', updateDimensions);
    setEditor(monacoEditor);
    monacoEditor.focus();
  };

  const editorChanged = (checked: boolean) => {
    updateState({ textType: checked ? 'md' : 'html' });
  };

  const editorConfig = {
    renderSideBySide: false,
    selectOnLineNumbers: true,
  };

  if (articleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" text="加载文章..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <CascaderSelect
            options={categoryOptions as any}
            value={category}
            onChange={onCascaderChange}
            placeholder="类目"
            className="w-[300px]"
          />
          <Input
            name="title"
            value={state.title}
            placeholder="标题"
            onChange={onInputChange}
            className="w-[280px]"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={onClickPublish} disabled={isPublishing}>
            {isPublishing ? '发布中...' : '是时候让大家看看神的旨意了'}
          </Button>
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={state.textType === 'md'}
              onCheckedChange={editorChanged}
            />
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Editor Section */}
      {state.textType === 'md' ? (
        <div className="flex gap-4 h-[calc(100vh-260px)] pt-5">
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language="markdown"
              theme="vs-dark"
              value={state.markdownContent}
              options={editorConfig}
              onChange={onEditorChange}
              onMount={editorDidMount}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-5 markdown">
            <ReactMarkdown>{state.markdownContent}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <Editor
          editorState={state.editorState}
          toolbarClassName="rdw-storybook-toolbar"
          wrapperClassName="rdw-storybook-wrapper"
          editorClassName="rdw-storybook-editor"
          toolbar={{
            image: {
              uploadCallback: uploadImageCallBack,
              previewImage: true,
            },
          }}
          onEditorStateChange={onEditorStateChange}
        />
      )}
    </div>
  );
}

export default Index;
