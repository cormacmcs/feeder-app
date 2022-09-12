import { signIn, signOut, useSession } from "next-auth/react";
import * as React from "react";

interface Props {
  children: JSX.Element;
}

export const Layout: React.FC<Props> = ({ children }): JSX.Element => {
  const { data: user } = useSession();
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button
          className="text-md leading-normal font-extrabold bg-indigo-300 p-3 m-3 rounded-md outline outline-indigo-600"
          onClick={async () => {
            await signOut();
            signIn("github", { callbackUrl: "http://localhost:3000/" });
          }}
        >
          Sign In
        </button>
        <button
          className="text-md leading-normal font-extrabold bg-indigo-300 p-3 m-3 rounded-md outline outline-indigo-600"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-start">
      <div>
        <button
          className="text-md leading-normal font-extrabold bg-indigo-300 p-3 m-3 rounded-md outline outline-indigo-600"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
      {children}
    </div>
  );
};
