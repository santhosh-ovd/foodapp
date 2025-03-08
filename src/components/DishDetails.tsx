'use client';

import { IndianDish } from '@/types/food';
import { Grid, Typography, Paper } from '@mui/material';

interface DishDetailsProps {
  dish: IndianDish;
}

/**
 * Component to display detailed information about a dish
 */
export function DishDetails({ dish }: DishDetailsProps) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            {dish.name}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h6">Ingredients</Typography>
          <Typography>{dish.ingredients}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6">Diet Type</Typography>
          <Typography>{dish.diet}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6">Course</Typography>
          <Typography>{dish.course}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6">Preparation Time</Typography>
          <Typography>
            {dish.prep_time === -1 ? 'Not specified' : `${dish.prep_time} minutes`}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6">Cooking Time</Typography>
          <Typography>
            {dish.cook_time === -1 ? 'Not specified' : `${dish.cook_time} minutes`}
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6">State</Typography>
          <Typography>{dish.state}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h6">Region</Typography>
          <Typography>{dish.region}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Flavor Profile</Typography>
          <Typography>
            {dish.flavor_profile === '-1' ? 'Not specified' : dish.flavor_profile}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
} 