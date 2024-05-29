import React, { useState } from 'react';
import { Avatar, Dialog, DialogContent, Stack, Typography, Box, IconButton } from '@mui/material';
import ReactPlayer from 'react-player';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const Status = () => {
    const users = [
        {
            ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
            Name: "Rehan"
        },
        {
            ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
            Name: "RehanShafqat"
        },
        {
            ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
            Name: "RehanShafqat"
        },
        {
            ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
            Name: "RehanShafqat"
        },
        {
            ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
            Name: "RehanShafqat"
        },
        {
            ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
            Name: "elbkjne"
        },
        {
            ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
            Name: "worjgn"
        },
        {
            ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
            Name: "worjgn"
        },
    ];;

    const [openVideoDialog, setOpenVideoDialog] = useState(Array(users.length).fill(false));
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleAvatarClick = (index) => {
        setOpenVideoDialog((prev) => prev.map((_, i) => i === index));
        setCurrentSlide(index);
    };

    const handleCloseVideoDialog = () => {
        setOpenVideoDialog((prev) => prev.map(() => false));
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + users.length) % users.length);
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % users.length);
    };

    return (
        <Box width="100%" sx={{ overflow: "hidden" }}>
            <Stack
                direction="row"
                overflow="hidden"
                width={`${users.length * 20}%`}
                style={{
                    transition: 'transform 0.5s ease',
                    transform: `translateX(-${(currentSlide * 100) / users.length}%)`,
                }}
            // border="1px solid black"
            >
                {users.map((user, index) => (
                    <React.Fragment key={index}>
                        <Stack direction="column" alignItems="center" width="100%" justifyContent="center" spacing={1}>
                            <Avatar
                                src={user.ImgSrc}
                                onClick={() => handleAvatarClick(index)}
                                sx={{
                                    width: '55px',
                                    height: '55px',
                                }}
                            />
                            <Typography component="p" fontSize="12px" color="initial">
                                {user.Name.length > 5 ? `${user.Name.substring(0, 5)}...` : user.Name}
                            </Typography>
                        </Stack>
                    </React.Fragment>
                ))}
            </Stack>
            <Stack direction="row" justifyContent="space-between" marginTop="10px">
                <IconButton onClick={handlePrevSlide} disabled={currentSlide === 0}>
                    <ArrowBackIosNewIcon />
                </IconButton>
                <IconButton onClick={handleNextSlide} disabled={currentSlide === users.length - 1}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Stack>
            {/* Video Dialog */}
            <Dialog open={openVideoDialog[currentSlide]} onClose={handleCloseVideoDialog} fullWidth>
                <DialogContent style={{ maxHeight: '80vh', height: '80vh' }}>
                    <ReactPlayer url={users[currentSlide].StatusSrc} width="100%" height="100%" />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Status;


// const users = [
//     {
//         ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
//         Name: "Rehan"
//     },
//     {
//         ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
//         Name: "RehanShafqat"
//     },
//     {
//         ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
//         Name: "RehanShafqat"
//     },
//     {
//         ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
//         Name: "RehanShafqat"
//     },
//     {
//         ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
//         Name: "RehanShafqat"
//     },
//     {
//         ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
//         Name: "elbkjne"
//     },
//     {
//         ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
//         Name: "worjgn"
//     },
//     {
//         ImgSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         StatusSrc: "https://www.youtube.com/shorts/orn35-mwfqY?feature=share",
//         Name: "worjgn"
//     },
// ];