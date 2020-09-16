import { FormControl, Input, InputLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { actions as loaderActions } from '@reducers/loading'
import { getRecipes } from '@shared/recipesApi'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import RecipeCard from './RecipeCard'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '235px',
  },
  search: {
    paddingBottom: theme.spacing(1),
  },
  cards: {
    display: 'block',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))

const Recipes = () => {
  const classes = useStyles()
  const [recipes, setRecipes] = useState([])
  const dispatch = useDispatch()

  const fetchRecipes = useCallback(async () => {
    dispatch(loaderActions.showLoader())
    const { data } = await getRecipes()
    setRecipes(data)
    dispatch(loaderActions.closeLoader())
  }, [dispatch])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <FormControl fullWidth>
          <InputLabel htmlFor="ff-name">Nome</InputLabel>
          <Input id="ff-name" name="recipeName" aria-describedby="ht-name" />
        </FormControl>
      </div>
      {recipes.map((recipe: any) => (
        // eslint-disable-next-line no-underscore-dangle
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  )
}

export default Recipes