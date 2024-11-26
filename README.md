# Product Management with Draggable Fields

## Description

This project allows users to manage products with variants. Users can:
- Add new product fields dynamically.
- Select products and their variants.
- Display selected products in a list with variant details.
- Remove variants from selected products.
- Utilize drag-and-drop functionality for reordering products and variants.
- Apply discounts to selected products.

This product is built using **React**, **Vite**, and **react-beautiful-dnd** for the drag-and-drop functionality, ensuring a smooth and optimized user experience.

## Features

- **Add New Product Field**: Users can click a button to add a new product field with a placeholder title and variants.
- **Select Products and Variants**: Products can be selected from a list of available products, and their variants can be chosen.
- **Remove Variants**: Variants can be removed from the selected products list.
- **Draggable Functionality**: Products and variants are draggable and can be reordered by the user using **react-beautiful-dnd**.
- **Apply Discounts**: Discounts can be added to selected products.
- **Search Functionality**: A search bar is provided to search for products by title.

## Screenshots

### Example of the Product List:
![Product List](./images/product-list.png)

## Getting Started

To run this project locally, follow the steps below:

### Prerequisites

- **Node.js** (preferably the latest LTS version)
- **npm** or **yarn** for package management
- **Vite** for fast React development
- **react-beautiful-dnd** for drag-and-drop functionality

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/product-management.git
   cd product-management

---

### Key Points in the README:

- **Description**: A brief overview of the functionality.
- **Features**: Highlights the key functionalities, such as adding products, selecting variants, removing variants, drag-and-drop, and applying discounts.
- **Setup Instructions**: Step-by-step guide for running the project locally.
- **Functions**: Examples of important functions like adding a new product, selecting products, removing variants, and applying discounts.
- **Folder Structure**: Overview of the project's folder structure for easier navigation.

src/
├── components/
│   ├── ProductList.jsx       # Displays the list of products and variants
│   ├── ProductDialog.jsx     # Dialog for selecting products
│   ├── DraggableProduct.jsx # Draggable product and variant components
├── App.js                    # Main App component
├── index.js                  # Entry point of the React app


