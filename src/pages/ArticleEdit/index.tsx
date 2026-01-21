import { useEffect, useState } from 'react';
import { Button, Cascader, Input, Layout, Spin, Switch } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
import MonacoEditor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import config from '@/helpers/config';
import { useCategories } from '@/hooks/useCategories';
import { useArticleEdit } from '@/hooks/useArticleEdit';
import './index.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function Index() {
  const { articleId, categoryId } = useParams();
  const navigate = useNavigate();
  const { data: categoryOptions = [], isLoading: categoriesLoading } = useCategories();

  const numArticleId = articleId ? parseInt(articleId, 10) : undefined;
  const {
    state,
    updateState,
    publishArticle,
    isLoading: articleLoading,
    isPublishing,
  } = useArticleEdit(numArticleId);

  const [category, setCategory] = useState<any[]>([]);
  const [editor, setEditor] = useState<any>(null);

  /**
   * 在选项树中查找对应节点的完整路径
   * @param options 选项树
   * @param targetId 目标ID
   * @param path 当前路径
   * @returns 完整路径数组，如果找不到返回 null
   */
  const findCategoryPath = (
    options: any[],
    targetId: number,
    path: number[] = []
  ): number[] | null => {
    for (const option of options) {
      const currentPath = [...path, option.value];
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
      setCategory(categoryPath || []);
    } else if (categoryId) {
      const categoryIdNum = parseInt(categoryId, 10);
      const categoryPath = findCategoryPath(categoryOptions, categoryIdNum);
      setCategory(categoryPath || []);
    }
  }, [state.categoryId, categoryId, categoryOptions]);

  const onCascaderChange = (value: any[]) => {
    setCategory(value);
  };

  const onEditorStateChange = (newEditorState: any) => {
    updateState({ editorState: newEditorState });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ title: e.target.value });
  };

  const onClickPublish = () => {
    const categoryIdValue = category.length > 0 ? category[category.length - 1] : 0;
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
    // focus the editor
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
      <Layout className="ArticleEdit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="加载文章..." />
      </Layout>
    );
  }

  return (
    <Layout className="ArticleEdit">
      <div
        style={{
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Input.Group compact>
          <Cascader
            value={category}
            style={{ maxWidth: 300, width: 300 }}
            options={categoryOptions}
            placeholder="类目"
            onChange={onCascaderChange}
            changeOnSelect
            loading={categoriesLoading}
          />
          <Input
            name="title"
            value={state.title}
            style={{ width: 280 }}
            placeholder="标题"
            onChange={onInputChange}
          />
        </Input.Group>
        <Button type="primary" onClick={onClickPublish} loading={isPublishing}>
          是时候让大家看看神的旨意了
        </Button>
        <Switch
          checkedChildren="Markdown"
          unCheckedChildren="RichText"
          onChange={editorChanged}
          checked={state.textType === 'md'}
        />
      </div>
      {state.textType === 'md' ? (
        <div className="markdown-container">
          <div className="monaco-container">
            <MonacoEditor
              height="600px"
              language="markdown"
              theme="vs-light"
              value={state.markdownContent}
              options={editorConfig}
              onChange={onEditorChange}
              onMount={editorDidMount}
            />
          </div>
          <div className="preview-container">
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
    </Layout>
  );
}

export default Index;
