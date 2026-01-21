import { useCallback, useEffect, useState } from 'react';
import { Button, Cascader, Input, Layout, message, Switch } from 'antd';
import { useParams } from 'react-router-dom';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import MonacoEditor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import config from '@/helpers/config';
import AdminServices from '@/services/AdminServices';
import BlogServices from '@/services/BlogServices';
import './index.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { handleOptions } from '@/utils/tools';

interface States {
  title: string;
  options: any[];
  category: any[];
  editor: any;
  textType: 'md' | 'html';
  editorState: any;
  markdownContent: string;
  articleId: number;
  categoryId: number;
}
function Index() {
  const { categoryId, articleId } = useParams();
  const [states, setStates] = useState<States>({
    title: '',
    options: [],
    category: [],
    editor: null,
    textType: 'md',
    editorState: null,
    markdownContent: '',
    articleId: articleId ? parseInt(articleId, 10) : 0,
    categoryId: categoryId ? +categoryId : 0,
  });

  // get category select options data.
  const getAllCategories = async () => {
    const resp: any = await BlogServices.getAllCategories().catch((err: any) => {
      message.error(`错误：${err}`);
      throw err;
    });
    if (resp.success) {
      const options = handleOptions(resp.data);
      setStates((prev) => ({ ...prev, options }));
      return options;
    } else {
      message.warning(resp.msg);
      return [];
    }
  };

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

  /**
   * 解析html文章展示
   * @param articleDetail
   */
  const initHtmlArticle = (articleDetail: any) => {
    const html = articleDetail ? articleDetail.content : '';
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setStates((prev) => ({ ...prev, editorState }));
    }
  };

  /**
   * 解析文档展示
   * @param detail
   * @param options 类目选项数据
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initArticle = (detail: any, options: any[] = []) => {
    if (detail.text_type === 'md') {
      setStates((prev) => ({ ...prev, markdownContent: detail.content }));
    } else if (detail.text_type === 'html') {
      initHtmlArticle(detail);
    }

    // 根据 category_id 查找完整路径
    const categoryPath = findCategoryPath(options, detail.category_id);

    setStates((prev) => ({
      ...prev,
      title: detail.title,
      textType: detail.text_type,
      category: categoryPath || [],
      categoryId: detail.category_id,
    }));
  };

  const getArticleDetail = useCallback(
    async (options: any[] = []) => {
      if (!articleId) return;
      const artId = parseInt(articleId, 10);
      const resp: any = await BlogServices.getArticleDetail(artId).catch((err: any) =>
        message.error(`错误：${err}`)
      );
      if (resp.success) {
        initArticle(resp.data, options);
      } else {
        message.warning(resp.msg);
      }
    },
    [articleId]
  );

  useEffect(() => {
    const initData = async () => {
      // 先加载类目选项
      const options = await getAllCategories();
      // 再加载文章详情（传入 options）
      await getArticleDetail(options);
    };
    initData();
  }, [getArticleDetail]);

  const onCascaderChange = (value: any[]) => {
    setStates((prev) => ({ ...prev, category: value, categoryId: value[value.length - 1] }));
  };

  const onEditorStateChange = (editorState: any) => {
    setStates((prev) => ({ ...prev, editorState }));
  };

  const onInputChange = (e: any) => {
    setStates((prev) => ({ ...prev, title: e.target.value }));
  };

  const publish = async (body: any) => {
    const resp: any = await AdminServices.publishArticle(body);
    if (resp.success) {
      message.success('发布成功！');
    } else {
      message.warning(resp.msg);
    }
  };

  const onClickPublish = () => {
    const {
      title,
      articleId: artId,
      categoryId: cateId,
      editorState,
      textType,
      markdownContent,
    } = states;
    let content = '';
    if (textType === 'md') {
      content = markdownContent;
    } else {
      const rawContent = convertToRaw(editorState.getCurrentContent());
      content = draftToHtml(rawContent);
    }

    const body: any = {
      title,
      categoryId: cateId,
      content,
      textType,
    };

    if (articleId) {
      body.id = artId;
    }
    publish(body);
  };

  const onEditorChange = (newValue: string | undefined) => {
    window.console.log('onChange', newValue);
    setStates((prev) => ({ ...prev, markdownContent: newValue || '' }));
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
    const { editor } = states;
    editor.layout();
  };

  const editorDidMount = (editor: any) => {
    window.addEventListener('resize', updateDimensions);
    setStates((prev) => ({ ...prev, editor }));
    // focus the editor
    editor.focus();
  };

  const editorChanged = (checked: boolean) => {
    setStates((prev) => ({
      ...prev,
      textType: checked ? 'md' : 'html',
    }));
  };

  const editorConfig = {
    renderSideBySide: false,
    selectOnLineNumbers: true,
  };
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
            value={states.category}
            style={{ maxWidth: 300, width: 300 }}
            options={states.options}
            placeholder="类目"
            onChange={onCascaderChange}
            changeOnSelect
          />
          <Input
            name="title"
            value={states.title}
            style={{ width: 280 }}
            placeholder="标题"
            onChange={onInputChange}
          />
        </Input.Group>
        <Button type="primary" onClick={onClickPublish}>
          是时候让大家看看神的旨意了
        </Button>
        <Switch
          checkedChildren="Markdown"
          unCheckedChildren="RichText"
          onChange={editorChanged}
          checked={states.textType === 'md'}
        />
      </div>
      {states?.textType === 'md' ? (
        <div className="markdown-container">
          <div className="monaco-container">
            <MonacoEditor
              height="600px"
              language="markdown"
              theme="vs-light"
              value={states.markdownContent}
              options={editorConfig}
              onChange={onEditorChange}
              onMount={editorDidMount}
            />
          </div>
          <div className="preview-container">
            <ReactMarkdown>{states.markdownContent}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <Editor
          editorState={states.editorState}
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
