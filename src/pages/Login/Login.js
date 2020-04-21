import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";
import clsx from "clsx";
import { useFormik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import authentication from "../../assets/images/authentication.svg";
import { useStateValue } from "../../context/StateContext";

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      maxWidth: 560,
      marginRight: "auto",
      marginLeft: "auto",
    },
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  banner: {
    margin: theme.spacing(1),
    height: "88px",
    width: "auto",
  },
  form: {
    marginTop: theme.spacing(),
    width: "100%",
  },
  buttonContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  buttonBack: {
    marginLeft: theme.spacing(2),
  },
}));

const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = "O campo é obrigatório";
  }

  if (!values.password) {
    errors.password = "O campo é obrigatório";
  }

  return errors;
};

const Login = () => {
  const [, dispatch] = useStateValue();
  const classes = useStyles();
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      const { username, password } = values;
      try {
        const user = await Auth.signIn({
          username,
          password,
        });
        dispatch({ type: "signed_in", user });
        history.push("/");
      } catch (error) {
        let err = null;
        !error.message ? (err = { message: error }) : (err = error);
        alert.log(err.message);
      }
    },
  });

  const handleToSignUp = () => {
    history.push("register");
  };

  return (
    <div className={clsx("page", classes.root)}>
      <Paper className={classes.paper}>
        <img
          className={classes.banner}
          src={authentication}
          alt="Banner da página de login"
        />
        <Typography variant="h5" component="h1">
          Login
        </Typography>
        <form
          className={classes.form}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={formik.touched.username && !!formik.errors.username}
              >
                <InputLabel htmlFor="ff-username">Nome do usuário</InputLabel>
                <Input
                  id="ff-username"
                  name="username"
                  autoComplete="username"
                  aria-describedby="ht-username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username ? (
                  <FormHelperText id="ht-username" error>
                    {formik.errors.username}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={formik.touched.password && !!formik.errors.password}
              >
                <InputLabel htmlFor="ff-password">Senha</InputLabel>
                <Input
                  id="ff-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  aria-describedby="ht-password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                  <FormHelperText id="ht-password" error>
                    {formik.errors.password}
                  </FormHelperText>
                ) : null}
              </FormControl>
            </Grid>
          </Grid>

          <div className={classes.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Acessar
            </Button>
            <Button
              type="button"
              variant="contained"
              className={classes.buttonBack}
              onClick={handleToSignUp}
            >
              Registrar
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
