import { Tag, Button, ConfigProvider, Drawer, Avatar, List, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { ParseStatus } from "@/libs/enums";

export default function PostButton(props: { buildPreviewImage: Function; permalink: string; mdData: string; title?: string; isPublish: string; imageQueue: ImageParse[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const onClose = () => {
    setOpen(false);
  };

  const isAllPreviewed = () => props.imageQueue.every((item) => item.status === ParseStatus.DONE);

  const onSubmit = () => {
    if (isAllPreviewed()) {
      console.log("发布/更新文章");
    } else {
      setOpen(true);
    }
  };
  const submitBtn = (
    <Button type="primary" onClick={onSubmit}>
      {props.isPublish ? "发布文章" : "保存草稿"}
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
      title="保存草稿"
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
              {props.isPublish ? "发布文章" : "保存草稿"}
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
      {imagePreviewDrawer}
      {submitBtn}
    </>
  );
}
