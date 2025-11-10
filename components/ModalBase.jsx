import dynamic from "next/dynamic";
import styles from "../styles/ModalBase.module.css";

const MantineModal = dynamic(
  () => import("@mantine/core").then((mod) => mod.Modal),
  { ssr: false }
);

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
    <MantineModal
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
    </MantineModal>
  );
};

export default ModalBase;

