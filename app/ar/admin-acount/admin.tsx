export type Admin = {
  user_type: "admin";
  name: string;
  phone: string;
  is_accepted: boolean;
  description: string;
  owes: number;
  currency: "EGP" | "USD";
  gender: "male" | "female";
};

const AdminContent: React.FC<{user: Admin}> = ({}) => {

  return <></>;
}

export default AdminContent;
