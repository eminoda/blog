import { Tag, Button, ConfigProvider, Drawer, Avatar, List, Space, Modal, Form, Input, Radio, DatePicker, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { ParseStatus } from "@/libs/enums";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";

dayjs.extend(customParseFormat);

export default function PostButton(props: { buildPreviewImage: Function; permalink: string; mdData: string; imageQueue: ImageParse[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const isPublish = props.permalink.split("/")[0] === "post" ? 1 : 0;

  const onClose = () => {
    setOpen(false);
  };

  const submitPost = () => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        axios
          .post("/api/post", Object.assign({}, values, { date: values.date.format("YYYY/MM/DD"), md: props.mdData }))
          .then(() => {
            message.success("提交成功");
          })
          .catch((err) => {
            message.error(err.message);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  type FieldType = {
    title: string;
    date: string;
    isPublish: string;
  };

  const postModal = (
    <Modal title="文件信息" open={modalOpen} onOk={submitPost} onCancel={() => setModalOpen(false)} okText="确认" cancelText="取消">
      <Form name="basic" form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} style={{ maxWidth: 600 }} initialValues={{ remember: true }} autoComplete="off">
        <Form.Item<FieldType> label="文章标题" name="title" rules={[{ required: true, message: "请输入文章标题" }]}>
          <Input placeholder="请输入文章标题" />
        </Form.Item>
        <Form.Item<FieldType> label="是否草稿" name="isPublish">
          <Radio.Group value={isPublish} disabled>
            <Radio value={0}>是</Radio>
            <Radio value={1}>否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item<FieldType> label="创作时间" name="date">
          <DatePicker format="YYYY/MM/DD" placeholder="请选择时间" />
        </Form.Item>
      </Form>
    </Modal>
  );

  // 表单初始化
  useEffect(() => {
    // https://stackoverflow.com/questions/61056421/warning-instance-created-by-useform-is-not-connect-to-any-form-element
    if (modalOpen) {
      const permalink = props.permalink.split("/");
      if (Array.isArray(permalink) && permalink.length >= 3) {
        form.setFieldsValue({ title: permalink[4], date: dayjs(permalink.slice(1, 4).join("/"), "YYYY/MM/DD") });
      }
      form.setFieldsValue({ isPublish });
    }
  }, [modalOpen]);

  const isAllPreviewed = () => props.imageQueue.every((item) => item.status === ParseStatus.DONE);

  const onSubmit = () => {
    if (isAllPreviewed()) {
      setModalOpen(true);
    } else {
      setOpen(true);
    }
  };
  const submitBtn = (
    <Button type="primary" onClick={onSubmit}>
      {isPublish ? "发布文章" : "保存草稿"}
    </Button>
  );

  const parseProgress = (item: ImageParse) => {
    if (item.status === ParseStatus.INIT) {
      return <Tag>未解析</Tag>;
    } else if (item.status === ParseStatus.PARSING) {
      return <Tag color="processing">解析中</Tag>;
    } else {
      return <Tag color="success">解析完毕</Tag>;
    }
  };

  const imagePreviewDrawer = (
    <Drawer
      open={open}
      onClose={onClose}
      title="预览图片"
      placement="right"
      width="40%"
      footer={
        <Space>
          {!isAllPreviewed() && (
            <Button type="primary" onClick={() => props.buildPreviewImage()}>
              生成预览图
            </Button>
          )}
          {isAllPreviewed() && (
            <Button type="primary" onClick={onSubmit}>
              {isPublish ? "发布文章" : "保存草稿"}
            </Button>
          )}
        </Space>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={props.imageQueue}
        renderItem={(item, index) => (
          <List.Item>
            <div className="flex flex-col items-start">
              <div>
                源链接：
                <Button type="link">{item.src}</Button>
              </div>
              <div>解析状态：{parseProgress(item)}</div>
              {item.status === ParseStatus.DONE && <img src={item.priviewUrl} className="w-1/2 mt-2" />}
            </div>
          </List.Item>
        )}
      />
    </Drawer>
  );

  return (
    <>
      {postModal}
      {imagePreviewDrawer}
      {submitBtn}
    </>
  );
}
