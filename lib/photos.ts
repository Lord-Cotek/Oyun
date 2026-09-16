/**
 * How many photographs one milestone or keepsake holds.
 *
 * Its own module, tiny and dependency-free, because both the browser (which
 * refuses more than this before uploading) and the server actions (which will
 * not store more than this however the request was made) need the number, and
 * the server has no business importing the Blob client SDK to learn it.
 *
 * Sixty is a wedding, or a week away. It was six, silently, which is how
 * fifty-three photographs of the Maldives were thrown away without a word.
 */
export const MAX_PHOTOS = 60;
