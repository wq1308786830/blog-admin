import React, { useEffect, useState } from 'react';
import { Button, Cascader, Input, Layout, message, Switch } from 'antd';
import { useParams } from 'react-router-dom';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import MonacoEditor from 'react-monaco-editor';
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
      setStates((prev) => ({ ...prev, options: handleOptions(resp.data, []) }));
    } else {
      message.warning(resp.msg);
    }
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
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initArticle = (detail: any) => {
    if (detail.text_type === 'md') {
      setStates((prev) => ({ ...prev, markdownContent: detail.content }));
    } else if (detail.text_type === 'html') {
      initHtmlArticle(detail);
    }

    setStates((prev) => ({
      ...prev,
      title: detail.title,
      textType: detail.text_type,
      category: detail.category ? Object.values(detail.category) : [],
    }));
  };

  const getArticleDetail = async () => {
    const { articleId: artId } = states;
    if (!articleId) return;
    const resp: any = await BlogServices.getArticleDetail(artId).catch((err: any) =>
      message.error(`错误：${err}`)
    );
    if (resp.success) {
      initArticle(resp.data);
    } else {
      message.warning(resp.msg);
    }
  };

  useEffect(() => {
    getAllCategories();
    getArticleDetail();
    // window.console.log(categories, detail);
  }, []);

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

  const onEditorChange = (newValue: string, e: any) => {
    window.console.log('onChange', newValue, e);
    setStates((prev) => ({ ...prev, markdownContent: newValue }));
  };

  const uploadImageCallBack = (file: any) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${config.Config[config.env]}/manage/uploadBlgImg`);
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
    editor.layout();
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
              language="markdown"
              theme="vs-light"
              value={states.markdownContent}
              options={editorConfig}
              onChange={onEditorChange}
              editorDidMount={editorDidMount}
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
