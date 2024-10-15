import Link from "next/link";
import Image from "next/image";
import { Container } from "./mainLayoutClient";

export default function Header() {
  return (
    <header className="pt-4">
      <Container className="relative w-full h-[10vh] mb-8">
        <Link href={"/"}>
          <Image src={"/main_logo.svg"} alt="Soddle Logo" fill priority />
        </Link>
      </Container>
    </header>
  );
}
