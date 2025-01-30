interface ArtistListProps {
  name: string;
  profilePicture: string;
  albumCover: string;
}

const ArtistListResult = ({
  name,
  profilePicture,
  albumCover,
}: ArtistListProps) => {
  return (
    <div className="flex m-4 ml-0">
      <div className="flex mb-4 mt-4 justify-center items-center">
        <img className="h-20 w-20 rounded-xl" src={profilePicture} />
        <div className="flex flex-col ml-4 items-center justify-center max-w-60">
          <span className="ml-4 font-bold">{name}</span>
        </div>
      </div>
    </div>
  );
};

export default ArtistListResult;
