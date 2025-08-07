export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    componentType: "input",
    type: "tel",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "identifier",
    label: "Email or Phone",
    placeholder: "Enter your email or phone number",
    componentType: "input",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "organic-clothing", label: "Organic Clothing" },
      { id: "eco-home", label: "Eco Home" },
      { id: "natural-beauty", label: "Natural Beauty" },
      { id: "sustainable-food", label: "Sustainable Food" },
      { id: "renewable-energy", label: "Renewable Energy" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "patagonia", label: "Patagonia" },
      { id: "seventh-generation", label: "Seventh Generation" },
      { id: "grove-collaborative", label: "Grove Collaborative" },
      { id: "earth-hero", label: "Earth Hero" },
      { id: "bamboo-earth", label: "Bamboo Earth" },
      { id: "green-toys", label: "Green Toys" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "All Products",
    path: "/shop/listing",
  },
  {
    id: "organic-clothing",
    label: "Organic Clothing",
    path: "/shop/listing",
  },
  {
    id: "eco-home",
    label: "Eco Home",
    path: "/shop/listing",
  },
  {
    id: "natural-beauty",
    label: "Natural Beauty",
    path: "/shop/listing",
  },
  {
    id: "sustainable-food",
    label: "Sustainable Food",
    path: "/shop/listing",
  },
  {
    id: "renewable-energy",
    label: "Renewable Energy",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  "organic-clothing": "Organic Clothing",
  "eco-home": "Eco Home", 
  "natural-beauty": "Natural Beauty",
  "sustainable-food": "Sustainable Food",
  "renewable-energy": "Renewable Energy",
};

export const brandOptionsMap = {
  "patagonia": "Patagonia",
  "seventh-generation": "Seventh Generation",
  "grove-collaborative": "Grove Collaborative",
  "earth-hero": "Earth Hero",
  "bamboo-earth": "Bamboo Earth",
  "green-toys": "Green Toys",
};

export const filterOptions = {
  category: [
    { id: "organic-clothing", label: "Organic Clothing" },
    { id: "eco-home", label: "Eco Home" },
    { id: "natural-beauty", label: "Natural Beauty" },
    { id: "sustainable-food", label: "Sustainable Food" },
    { id: "renewable-energy", label: "Renewable Energy" },
  ],
  brand: [
    { id: "patagonia", label: "Patagonia" },
    { id: "seventh-generation", label: "Seventh Generation" },
    { id: "grove-collaborative", label: "Grove Collaborative" },
    { id: "earth-hero", label: "Earth Hero" },
    { id: "bamboo-earth", label: "Bamboo Earth" },
    { id: "green-toys", label: "Green Toys" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
