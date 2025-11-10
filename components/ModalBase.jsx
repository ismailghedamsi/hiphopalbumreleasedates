import { Modal } from "@mantine/core";
import styles from "../styles/ModalBase.module.css";

const ModalBase = ({
  opened,
  title,
  onClose,
  children,
  size = "md",
  overlayProps,
  ...rest
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      radius="lg"
      size={size}
      trapFocus
      returnFocus
      overlayProps={{
        color: "#0f172a",
        opacity: 0.55,
        blur: 2,
        ...overlayProps,
      }}
      classNames={{
        content: styles.content,
        header: styles.header,
        title: styles.title,
        body: styles.body,
        close: styles.close,
      }}
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default ModalBase;

