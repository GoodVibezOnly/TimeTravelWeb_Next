import Image from "next/image";
import FileUploader from "../components/FileUploader";
import BottomBar from "@/components/BottomBar";

export default function Home() {
  return (
    <main>
      <FileUploader />
      <BottomBar version=" 0.8.1" />
    </main>
  );
}
