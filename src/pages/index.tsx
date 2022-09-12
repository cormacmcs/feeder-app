import { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { Layout } from "../components/layouts/Layout";

const Home: NextPage = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const utils = trpc.useContext();
  const { data: pets } = trpc.useQuery(["pet.getPets"]);
  const createPet = trpc.useMutation(["pet.createPet"], {
    onSuccess() {
      utils.invalidateQueries(["pet.getPets"]);
      setName("");
      setLoading(false);
    },
    onError() {
      setLoading(false);
    }
  });
  const removePet = trpc.useMutation(["pet.removePet"], {
    onSuccess() {
      utils.invalidateQueries(["pet.getPets"]);
      setName("");
    }
  });
  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    const name = target.name.value;
    if (name.trim() !== "") {
      createPet.mutate({
        name
      });
      setLoading(true);
    }
  };
  return (
    <main className="container w-fit mx-auto flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-xl leading-normal font-extrabold text-gray-700">
        Add Pet
      </h1>
      {!loading && (
        <form onSubmit={submitHandler}>
          <label htmlFor="name" className="text-2xl text-gray-700">
            Name
          </label>
          <input
            className="outline-indigo-500 bg-slate-200 ml-3"
            id="name"
            name="name"
            type="name"
            onChange={event => setName(event.target.value)}
            value={name}
          />
          <div className="flex justify-end mt-3">
            <input
              className="bg-indigo-200 px-5 py-2 cursor-pointer rounded-md border-2 border-indigo-500"
              type="submit"
              value="Add"
            />
          </div>
        </form>
      )}
      <ul className="w-full h-1/2">
        {pets
          ? pets.map(pet => (
              <li
                className="flex justify-between items-center text-md leading-normal font-extrabold h-10 border-t-2 border-t-slate-200 first:border-t-0"
                key={pet.id}
              >
                <div className="">{pet.name}</div>
                <button onClick={() => removePet.mutate({ id: pet.id })}>
                  x
                </button>
              </li>
            ))
          : ""}
      </ul>
    </main>
  );
};

const WrappedHome = () => (
  <Layout>
    <Home />
  </Layout>
);

export default WrappedHome;
