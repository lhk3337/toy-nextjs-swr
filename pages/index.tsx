import React from "react";
import useSWR from "swr";

export default () => {
  const { data, mutate } = useSWR("api/prettyDogs");

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    if (name === "next") {
      mutate();
    } else if (name === "like") mutate((prev: any) => ({ isLiked: !prev.isLiked }), false);
  };

  return (
    <div className="bg-[#222f3e] p-10 rounded-lg">
      <h1 className="text-4xl font-bold text-white text-center">댕댕 티비</h1>
      <div className=" flex justify-center border-white rounded-xl border-2 my-20 max-w-xl h-96 mx-auto">
        <video src={data?.data?.url} autoPlay muted />
      </div>
      <div className="flex justify-center my-12">
        <button
          name="next"
          onClick={onClick}
          className="py-2 mr-10 w-[250px] rounded-xl bg-pink-500 text-white font-bold"
        >
          다른 귀여운 댕댕이 보기
        </button>
        {!data?.isLiked ? (
          <button
            name="like"
            onClick={onClick}
            className="py-2  bg-slate-600 w-[250px] rounded-xl text-white font-bold"
          >
            좋아요
          </button>
        ) : (
          <button
            name="like"
            onClick={onClick}
            className="py-2 text-slate-600  bg-white w-[250px] rounded-xl  font-bold"
          >
            싫어요
          </button>
        )}
      </div>
    </div>
  );
};
