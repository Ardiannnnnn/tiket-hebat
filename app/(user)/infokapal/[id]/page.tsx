import Image from "next/image";

export default function InfoKapal() {
  return (
    <div className="flex flex-col justify-center items-center m-10">
      <h1 className="text-2xl font-bold mb-4">Informasi Kapal</h1>
      <p className="text-lg text-gray-600">
        Informasi mengenai kapal yang tersedia untuk perjalanan Anda.
      </p>
      {/* Tambahkan komponen atau informasi kapal di sini */}
      <div>
        <Image
          src="/image/aceh-hebat-1.jpeg"
          alt="Kapal"
          width={600}
          height={400}
          className="rounded-lg mt-6">
        </Image>
        <p className="text-center text-gray-600">Kapal Aceh Hebat 1</p>
      </div>
      <div className="text-justify mt-6 max-w-2xl text-gray-700">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae dolorem illum eos ut iusto ea amet magnam fugiat, consectetur, autem aut explicabo dolorum sapiente tempore id quam? Possimus optio ut quod iure porro dignissimos laborum ab a ipsum, eaque eos placeat cum. Deserunt deleniti, officia eligendi illo possimus dignissimos consectetur beatae laudantium. Laboriosam deserunt praesentium esse eos, ab minima atque mollitia, repudiandae, exercitationem accusantium ut. Dicta tempora voluptate obcaecati possimus laboriosam laudantium nobis illo consequuntur asperiores odit labore architecto sunt delectus, error necessitatibus ducimus corrupti qui voluptas in blanditiis. Quibusdam reiciendis architecto voluptate minima id laborum natus praesentium voluptas magnam.
      </div>
    </div>
  );
}
