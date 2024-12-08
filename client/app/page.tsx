import Image from "next/image";

export default function Home() {
  return (
    <div className="w-3/5 flex flex-col space-y-4">
      <h1>Welcome to triptuned.</h1>
      <p>A very simple website that aims to solve music/playlist genertaion for your trips. It can be a <strong>drive to your office, grocery store or a cross country drive</strong></p>
    </div>
  );
}
