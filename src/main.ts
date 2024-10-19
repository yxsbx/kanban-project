import FormComponent from "./components/Form.js";
import NavBar from "./components/NavBar.js";
import "./styles/style.css";

new NavBar().init().then(() => {
  new FormComponent();
});
