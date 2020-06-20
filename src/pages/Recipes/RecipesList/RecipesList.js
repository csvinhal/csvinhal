import { useQuery, useMutation } from "@apollo/react-hooks";
import { Button, Fab, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { Pagination } from "@material-ui/lab";
import { gql } from "apollo-boost";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import recipeNotFound from "../../../assets/images/recipe-not-found.svg";
import DeleteDialog from "../../../components/DeleteDialog/DeleteDialog";
import EmptyState from "../../../components/EmptyState/EmptyState";
import Header from "../../../components/Header/Header";
import Loading from "../../../components/Loading/Loading";
import RecipeCard from "./RecipeCard/RecipeCard";

const RECIPES = gql`
  query($offset: Int, $limit: Int) {
    recipes(offset: $offset, limit: $limit) {
      records {
        id
        recipeName
        description
      }
      total
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation($id: ID!) {
    deleteRecipe(id: $id) {
      success
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  emptyState: {
    margin: "auto",
  },
  button: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  paginator: {
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
  fabButton: {
    position: "fixed",
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const RecipesList = () => {
  const [limit] = useState(10);
  const { loading, data, fetchMore, refetch } = useQuery(RECIPES, {
    variables: { offset: 0, limit },
  });
  const [deleteRecipe] = useMutation(DELETE_RECIPE);
  const [page, setPage] = useState(1);
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  if (loading) return <Loading open />;

  const { recipes } = data;
  const { records, total } = recipes;

  const getOffset = (page) => {
    return (page - 1) * 10;
  };

  const getTotalPages = (totalRecords) => {
    const totalPages = Math.ceil(totalRecords / 10);
    if (totalPages > 5) {
      return 5;
    }
    return totalPages;
  };

  const handlerAdd = () => {
    history.push("/recipes/add");
  };

  const handleRemove = (id) => {
    setIdToDelete(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIdToDelete(null);
  };

  const handleConfirm = async () => {
    setOpen(false);
    await deleteRecipe({
      variables: { id: idToDelete },
    });
    await refetch({
      offset: getOffset(page),
      limit,
    });
    setIdToDelete(null);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    fetchMore({
      variables: {
        offset: getOffset(value),
        limit,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          recipes: { ...prev.recipes, ...fetchMoreResult.recipes },
        });
      },
    });
  };

  const offset = getOffset(page);
  const first = offset + 1;
  const last = Math.min(offset + limit, total);

  let content;

  if (records.length) {
    content = content = (
      <>
        <Header title="Receitas" />
        <Paper elevation={2} className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={handlerAdd}
              >
                Adicionar
              </Button>
            </Grid>
            {records.map((recipe) => (
              <Grid key={recipe.id} item xs={12} sm={6} md={4} lg={3}>
                <RecipeCard recipe={recipe} handleRemove={handleRemove} />
              </Grid>
            ))}
            <Grid item xs={12}>
              <div className={classes.paginator}>
                <span>
                  {first}-{last} de {total}
                </span>
                <Pagination
                  count={getTotalPages(total)}
                  color="primary"
                  page={page}
                  onChange={handleChangePage}
                />
              </div>
            </Grid>
            <Fab
              className={classes.fabButton}
              color="primary"
              aria-label="add"
              onClick={handlerAdd}
            >
              <AddIcon />
            </Fab>
          </Grid>
        </Paper>
      </>
    );
  } else {
    content = (
      <EmptyState
        className={classes.emptyState}
        title="Ops!"
        image={recipeNotFound}
        text="Parece que você não tem nenhuma receita cadastrada."
        primaryActionLabel="Adicionar"
        handlePrimaryAction={handlerAdd}
      />
    );
  }
  return (
    <div>
      <DeleteDialog
        open={open}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      ></DeleteDialog>
      {content}
    </div>
  );
};

RecipesList.propTypes = {};

export default connect(null, null)(RecipesList);
