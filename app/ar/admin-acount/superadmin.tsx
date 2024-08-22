export type Superadmin = {
  user_type: "superadmin";
  name: string;
  phone: string;
  appear: boolean;
  other_gender: boolean;
  description: string;
  hour_price: number;
  currency: "EGP" | "USD";
  gender: "male" | "female";
};

const SuperadminContent: React.FC<{user: Superadmin}> = ({}) => {

  return <></>;
}

export default SuperadminContent;
