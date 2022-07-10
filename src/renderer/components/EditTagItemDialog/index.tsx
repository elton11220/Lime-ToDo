import React, { memo, useCallback, useMemo, useRef } from 'react';
import { Dialog, Form, Input } from 'tdesign-react';
import ColorPicker from '../ColorPicker';

const { FormItem } = Form;

interface EditTagItemDialogProps {
  state: {
    id?: string;
    show?: boolean;
  };
  tags: TagItem[];
  colors: string[];
  setState: any;
  onConfirm: (item: TagItem) => void;
}

const EditTagItemDialog: React.FC<EditTagItemDialogProps> = (props) => {
  const { state, onConfirm, tags, setState, colors } = props;
  const editTagItemDialogForm = useRef<HTMLFormElement>();
  const tag = useMemo(
    () => tags.find((item) => item.id === state.id),
    [state.id, tags]
  );
  const onSubmit = useCallback(() => {
    onConfirm({
      id: state.id,
      ...editTagItemDialogForm.current?.getFieldsValue(['color', 'title']),
    });
    setState({ show: false });
  }, [onConfirm, setState, state.id]);
  return (
    <Dialog
      visible={state.show}
      header="编辑标签"
      confirmBtn="保存"
      showOverlay={false}
      destroyOnClose
      onClose={() => {
        setState({ show: false });
      }}
      onConfirm={onSubmit}
    >
      <Form ref={editTagItemDialogForm} style={{ marginTop: '20px' }}>
        <FormItem
          label="名称"
          name="title"
          rules={[
            { message: '标签名称不能为空', type: 'error', required: true },
          ]}
          initialData={tag?.title}
        >
          <Input placeholder="标签" />
        </FormItem>
        <FormItem label="颜色" name="color" initialData={tag?.color}>
          {
            // @ts-ignore
            React.createElement(ColorPicker, { colors })
          }
        </FormItem>
      </Form>
    </Dialog>
  );
};

export default memo(EditTagItemDialog);
