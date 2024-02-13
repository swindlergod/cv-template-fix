import Box from '@mui/material/Box';
import Masonry from '@mui/lab/Masonry';
import { useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useAppDispatch } from '@/hooks/cvTemplateHooks';
import { setProps } from '@/store/landingBuilder/layoutSlice';
import { IElementsProps } from '@/types/landingBuilder';
import { Alert } from '@mui/material';

const MasonryGallery = ({ props, layout }: IElementsProps) => {
  const dispatch = useAppDispatch();
  const { MasonryGallery } = props;
  const currentList = MasonryGallery || [];

  useEffect(() => {
    if (currentList.length === 0) {
      const firstItem = {
        id: layout.i,
        values: [
          {
            id: nanoid(),
            img: '',
            title: '',
          },
        ],
        size: 1,
      };
      dispatch(setProps(firstItem));
    }
  }, []);

  const elementsContainsPicture = currentList.some((item) => String(item.img).length > 0);

  return (
    <>
      {elementsContainsPicture ? (
        <Box sx={{ width: '100%', minHeight: 829 }}>
          <Masonry columns={(props.size || 1).toString()} spacing={2}>
            {currentList &&
              currentList.map((item) => (
                <div key={item.id}>
                  <img
                    srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
                    src={`${item.img}?w=162&auto=format`}
                    alt={String(item.title)}
                    loading="lazy"
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      display: 'block',
                      width: '100%',
                    }}
                  />
                </div>
              ))}
          </Masonry>
        </Box>
      ) : (
        <Alert variant="outlined" severity="info">
          Add your pictures
        </Alert>
      )}
    </>
  );
};

export default MasonryGallery;
