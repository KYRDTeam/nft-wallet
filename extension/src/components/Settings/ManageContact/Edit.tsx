import Form from "./Form";

type AccountProps = {
  id: string;
  name: string;
  address: string;
};

const Edit = ({ data, handleClose }: { data: AccountProps; handleClose: (e?: any) => void }) => {
  return <Form initValues={data} isEdit handleClose={handleClose} />;
};

export default Edit;
