const page = ({ params }: { params: { id: string } }) => {
  console.log(params);
  return <div>{params.id}</div>;
};

export default page;
