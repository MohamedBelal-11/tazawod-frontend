/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
export default function LoadingDiv({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <div
        className="h-screen w-full flex justify-center items-center bg-gray-100 absolute top-0 flex-col gap-4"
        style={{ zIndex: 30 }}
      >
        <img src="/static/imgs/quran.gif" width={100} />
        <p className="text-3xl font-bold text-green-700">تزود</p>
      </div>
    );
  }
  return <></>;
}
