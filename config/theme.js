// Colors
import colors from 'vuetify/lib/util/colors';

const palette = {
  violeta: {
    primary: colors.grey.darken4, // primary main - dark grey
    primarylight: colors.grey.lighten3, // primary light - light grey
    primarydark: colors.shades.black, // primary dark - black
    secondary: colors.shades.black, // secondary main
    secondarylight: colors.grey.lighten1, // secondary light - lighter grey
    secondarydark: colors.shades.white, // secondary dark
    anchor: colors.grey.darken4, // link - dark grey
  },
};

const theme = {
  ...palette.violeta,
};

export default theme;
