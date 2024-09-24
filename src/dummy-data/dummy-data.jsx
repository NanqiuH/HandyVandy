const profiles = [
  {
    id: 1,
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    bio: "Aspiring chef specializing in rotisserie chicken",
    profileImage: "https://www.shutterstock.com/image-photo/profile-handsome-african-man-260nw-71421109.jpg",
    posts: [
      { id: 1, title: "Rotisserie Chicken Special", price: 15 },
      { id: 2, title: "BBQ Chicken Wings", price: 10 },
    ],
  },
  {
    id: 2,
    firstName: "Sam",
    middleName: "S.",
    lastName: "Tay",
    bio: "A bagpipe player with a passion for funerals",
    profileImage: "https://www.shutterstock.com/shutterstock/photos/488059486/display_1500/stock-photo-scottish-bagpiper-playing-bagpipes-in-the-circle-of-the-scottish-national-symbol-thistle-488059486.jpg",
    posts: [
      { id: 1, title: "Bagpipes for Sale", price: 200 },
      { id: 2, title: "Traditional Scottish Music CD", price: 15 },
    ],
  },
  {
    id: 3,
    firstName: "Bob",
    middleName: "Bobert",
    lastName: "Bobertson",
    bio: "Looking to purchase some goodies",
    profileImage: "https://i.pinimg.com/originals/97/11/e9/9711e9598ff93679196b43519092faf7.jpg",
    posts: [
      { id: 1, title: "Collectible Bobblehead", price: 25 },
      { id: 2, title: "Vintage Comic Book", price: 10 },
    ],
  },
];

export default profiles;
