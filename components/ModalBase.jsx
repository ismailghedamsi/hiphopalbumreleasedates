import { Modal } from "@mantine/core";

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
      withinPortal={false}
      trapFocus
      returnFocus
      overlayProps={{
        color: "#0f172a",
        opacity: 0.55,
        blur: 2,
        ...overlayProps,
      }}
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default ModalBase;

