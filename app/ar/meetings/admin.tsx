interface Meet {
  status: "didnt_start" | ""
}

type Responset =
  | {
      is_accepted: true;
      meetings: Meet[];
    }
  | {
      is_accepted: false;
    }
  | null;


const AdminContent: React.FC<{ isSuper: boolean }> = ({ isSuper }) => {
  return <></>;
};

export default AdminContent;
