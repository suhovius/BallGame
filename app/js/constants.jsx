// Gravity
// 9.8 m/s2
// We use ms as time
// Suppose that 1 px is 1 mm than
// 1 m = 1000 mm
// 9.8 * 1000 mm / (1000 ms * 1000 ms)
// 9.8 * 1000 / ( 1000 * 1000 ) =0.0098 px/ms2
const GRAVITY_ACCELERATION = 0.098;
const GAME_AREA_BORDER = 100; // px

export { GRAVITY_ACCELERATION, GAME_AREA_BORDER }
