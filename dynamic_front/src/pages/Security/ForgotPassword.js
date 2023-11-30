import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../Forms/Register/Register.module.scss";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [feedback, setFeedBack] = useState("");
  const [feedbackGood, setFeedBackGood] = useState("");
  const navigate = useNavigate();

  const yupSchema = yup.object({
    email: yup
      .string()
      .required("Le champ est obligatoire")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Votre email n'est pas valide"
      ),
  });

  const defaultValues = {
    email: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(yupSchema),
  });

  async function submit(values) {
    console.log(values);
    try {
      await fetch(
        `http://localhost:8000/api/users/resetPassword/${values.email}`
      );
    } catch (error) {
      console.error(error);
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
        {feedback && <p className={`${styles.feedback} mb20`}>{feedback}</p>}
        {feedbackGood && (
          <p className={`${styles.feedbackGood} mb20`}>{feedbackGood}</p>
        )}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
