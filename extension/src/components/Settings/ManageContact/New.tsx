import Form from "./Form";

const New = ({ handleClose }: { handleClose: (e?: any) => void }) => {
  return <Form initValues={{ id: "", name: "", address: "" }} handleClose={handleClose} />;
};

export default New;
