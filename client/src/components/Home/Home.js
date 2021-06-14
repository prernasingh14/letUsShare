import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Grow, Grid, Paper, TextField, AppBar, Button } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination';
import useStyles from './styles';

import { getPosts, getPostsBySearch } from '../../actions/posts';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}
const Home = () => {

    const [currentId, setCurrentId] = useState(0);
    const dispatch = useDispatch();
    const classes = useStyles();
    const query = useQuery();
    const history = useHistory();
    const page = query.get('page') || 1;//it'll read our url & see whether we have a page parameter in it or not (and if we don't have the page we must be on the first one)
    const searchQuery = query.get('searchQuery');
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
    const searchPost = () => {
        if (search.trim() || tags) { //dispatch fetch search posts 
            dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
            history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
        } else {
            history.push('/');
        }

    }
    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {//if we press enter key 
            searchPost();
        }

    }
    const handleAddChip = (tag) => setTags([...tags, tag]);

    const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));
    return (
        <Grow in>
            <Grid className={classes.gridContainer} container justify="space-between" alignItems="stretch" spacing={2}>
                <Grid item xs={12} sm={8} md={9} lg={9}>
                    <Posts setCurrentId={setCurrentId} />
                </Grid>
                <Grid item xs={12} sm={4} md={3} lg={3}>
                    <AppBar className={classes.appBarSearch} position="static" color="inherit">
                        <TextField
                            name="search"
                            variant="outlined"
                            label="Search Memories"
                            fullWidth
                            value={search}
                            onKeyPress={handleKeyPress}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <ChipInput
                            style={{ margin: '10px 0' }}
                            value={tags}
                            onAdd={(chip) => handleAddChip(chip)}
                            onDelete={(chip) => handleDeleteChip(chip)}
                            variant="outlined"
                            label="Search Tags"
                        />
                        <Button onClick={searchPost} className={classes.searchName} variant="contained" color="primary">Search</Button>
                    </AppBar>
                    <Form currentId={currentId} setCurrentId={setCurrentId} />
                    {(!searchQuery && !tags.length) &&
                        <Paper elevation={6} className={classes.pagination}>
                            <Pagination page={page} />
                        </Paper>
                    }
                </Grid>
            </Grid>
        </Grow>
    )
}

export default Home;