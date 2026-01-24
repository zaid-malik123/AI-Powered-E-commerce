const Card = ({ item }) => {
  return (
    <div className="w-full h-75 md:h-100  flex flex-col">
      <img src={item.image} alt={item.title} className="h-[80%] object-cover" />
      <div className="p-2">
        <h3 className="text-sm font-medium line-clamp-1">
          {item.title}
        </h3>
        <p className="text-gray-600">${item.price}</p>
      </div>
    </div>
  );
};


export default Card