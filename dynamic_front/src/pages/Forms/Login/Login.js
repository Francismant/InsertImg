import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../Register/Register.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context";

export default function Login() {
  const [feedback, setFeedBack] = useState("");
  const [feedbackGood, setFeedBackGood] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const yupSchema = yup.object({
    email: yup
      .string()
      .required("Le champ est obligatoire")
      .email("Vous devez saisir un email valide"),
    password: yup.string().required("Le champ est obligatoire"),
  });

  const defaultValues = {
    password: "",
    email: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(yupSchema),
  });

  async function submit(values) {
    setFeedBack("");
    console.log(values);
    const response = await fetch("http://localhost:8000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      const newUser = await response.json();
      console.log("User récupéré", newUser);
      if (newUser.message) {
        setFeedBack(newUser.message);
      } else {
        setFeedBackGood("Connexion réussie, vous allez être redirigé");
        reset(defaultValues);
        setUser(newUser);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    }
  }

  return (
    <div className="flex-fill d-flex flex-column justify-content-center align-items-center">
      <form onSubmit={handleSubmit(submit)}>
        <div className="d-flex flex-column mb10">
          <label htmlFor="email" className="mb10">
            Email
          </label>
          <input type="email" id="email" {...register("email")} />
          {errors?.email && (
            <p className={`${styles.feedback}`}>{errors.email.message}</p>
          )}
        </div>
        <div className="d-flex flex-column mb10">
          <label htmlFor="password" className="mb10">
            Password
          </label>
          <input type="password" id="password" {...register("password")} />
          {errors?.password && (
            <p className={`${styles.feedback}`}>{errors.password.message}</p>
          )}
        </div>
        {feedback && <p className={`${styles.feedback} mb20`}>{feedback}</p>}
        {feedbackGood && (
          <p className={`${styles.feedbackGood} mb20`}>{feedbackGood}</p>
        )}
        <div className="d-flex flex-column mb20">
          <NavLink to="/forgot">Mot de passe oublié</NavLink>
        </div>
        <button className="btn btn-primary" disabled={isSubmitted}>
          Submit
        </button>
      </form>
    </div>
  );
}
