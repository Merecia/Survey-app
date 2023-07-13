import React, { FC, useState, useMemo } from 'react';
import style from './Header.module.scss';
import QuizIcon from '@mui/icons-material/Quiz';
import PollIcon from '@mui/icons-material/Poll';
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useActions } from '../../hooks/useActions';
import { stringAvatar } from '../../helper';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { SurveyType } from '../../types/survey';
import { useNavigate } from 'react-router-dom';
import {
    Typography, TextField, Avatar, IconButton, List, 
    ListItemButton, ListItemIcon, ListItem, ListItemText,
} from '@mui/material';

const Header: FC = () => {
    const navigate = useNavigate();
    const [showDropdownMenu, setShowDropdownMenu] = useState<boolean>(false);
    const { 
        updateUser, 
        updateChoicedType, 
        updateSearchQuery
    } = useActions();
    const { user, choicedType, searchQuery } = useTypedSelector(state => state.survey);

    const black = '#000000';
    const grey = '#e0e0e0';

    const renderDropdownMenu = () => {
        return (
            <List
                sx={{ bgcolor: 'background.paper' }}
                className = {style.DropdownMenu}
            >
                <ListItem style={{ padding: '5px' }}>
                    <ListItemButton onClick={() => navigate('/survey-constructor')}>
                        <ListItemIcon>
                            <AddCircleOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create Survey" />
                    </ListItemButton>
                </ListItem>
                <ListItem style={{ padding: '5px' }}>
                    <ListItemButton onClick={signOutHandler}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" />
                    </ListItemButton>
                </ListItem>
            </List>
        );
    }

    const searchbarChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateSearchQuery(event.target.value);
    }

    const renderSearchbar = (searchQuery: string) => {
        return (
            <TextField
                id="search-bar"
                className={style.Searchbar}
                onChange={searchbarChangeHandler}
                variant="outlined"
                placeholder="Search..."
                value = {searchQuery}
                size="small"
                sx={{ width: '470px' }}
            />
        );
    }

    const signOutHandler = () => {
        signOut(auth).then(() => {
            updateUser(null);
            setShowDropdownMenu(false);
        })
    }

    return (
        <div className={style.Header}>
            <Typography
                variant={"h4"}
                component={"h4"}
                className={style.AppName}
                onClick = {() => navigate('/')}
            >
                Survey App
            </Typography>
            <div className={style.Search}>
                { 
                    useMemo(
                        () => renderSearchbar(searchQuery), 
                        [searchQuery]
                    ) 
                }
                <IconButton aria-label="search">
                    <SearchIcon style={{ fill: "black" }} />
                </IconButton>
            </div>
            <div className={style.Types}>
                <div className={style.Surveys} onClick={() => updateChoicedType(SurveyType.Unevaluated)}>
                    <Typography
                        variant={"h6"}
                        component={"h6"}
                        sx={{ marginRight: '10px' }}
                        color={choicedType === SurveyType.Unevaluated ? black : grey}
                    >
                        Surveys
                    </Typography>
                    <PollIcon
                        style={{ fill: choicedType === SurveyType.Unevaluated ? black : grey }}
                    />
                </div>
                <div className={style.Quizes} onClick={() => updateChoicedType(SurveyType.Evaluated)}>
                    <Typography
                        variant={"h6"}
                        component={"h6"}
                        sx={{ marginRight: '10px' }}
                        color={choicedType === SurveyType.Evaluated ? black : grey}
                    >
                        Quizes
                    </Typography>
                    <QuizIcon
                        style={{ fill: choicedType === SurveyType.Evaluated ? black : grey }}
                    />
                </div>
            </div>
            <div className={style.Avatar_DropdownMenu}>
                {
                    user
                        ? <Avatar
                            {...stringAvatar(user.displayName)}
                            onClick={() => setShowDropdownMenu(!showDropdownMenu)}
                            className={style.Avatar}
                        />
                        : <Typography
                            variant={"h6"}
                            component={"h6"}
                            onClick={() => navigate('./auth')}
                            style={{ cursor: 'pointer' }}
                        >
                            Sign in
                        </Typography>
                }

                {showDropdownMenu && renderDropdownMenu()}
            </div>
        </div>
    )
}

export default Header;