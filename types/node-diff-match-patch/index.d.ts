// Type definitions for node-diff-match-patch 1.0
// Project: https://github.com/magicsky/node-diff-match-patch
// Definitions by: Yasushi Kato <https://github.com/karak>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.1

declare module 'diff-match-patch' {
	export const DIFF_DELETE: number;
	export const DIFF_INSERT: number;
	export const DIFF_EQUAL: number;

	/** Class containing the diff, match and patch methods. */
	export class diff_match_patch {
		/** Number of seconds to map a diff before giving up (0 for infinity). */
		Diff_Timeout: number;

		/** Cost of an empty edit operation in terms of edit characters. */
		Diff_EditCost: number;

		/** At what point is no match declared (0.0 = perfection, 1.0 = very loose). */
		Match_Threshold: number;

		/**How far to search for a match (0 = exact location, 1000+ = broad match).
		 * A match this many characters away from the expected location will add
		 * 1.0 to the score (0.0 is a perfect match).
		 */
		Match_Distance: number;

		/**When deleting a large block of text (over ~64 characters), how close do
		 * the contents have to be to match the expected contents. (0.0 = perfection,
		 * 1.0 = very loose).  Note that Match_Threshold controls how closely the
		 * end points of a delete need to match.
		 */
		Patch_DeleteThreshold: number;

		/** Chunk size for context length. */
		Patch_Margin: number;

		/** The number of bits in an int. */
		Match_MaxBits: number;

		/**
		 * Find the differences between two texts.  Simplifies the problem by stripping
		 * any common prefix or suffix off the texts before diffing.
		 * @param {string} text1 Old string to be diffed.
		 * @param {string} text2 New string to be diffed.
		 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
		 *     then don't run a line-level diff first to identify the changed areas.
		 *     Defaults to true, which does a faster, slightly less optimal diff.
		 * @param {number} opt_deadline Optional time when the diff should be complete
		 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
		 *     instead.
		 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
		 */
		diff_main(text1: string, text2: string, opt_checklines?: boolean, opt_deadline?: number): diff_match_patch.Diff[];
		
		/**
		 * Find the 'middle snake' of a diff, split the problem in two
		 * and return the recursively constructed diff.
		 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
		 * @param {string} text1 Old string to be diffed.
		 * @param {string} text2 New string to be diffed.
		 * @param {number} deadline Time at which to bail if not yet complete.
		 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
		 * @private
		 */
		diff_bisect_(text1: string, text2: string, deadline: number): diff_match_patch.Diff[];

		/**
		 * Split two texts into an array of strings.  Reduce the texts to a string of
		 * hashes where each Unicode character represents one line.
		 * @param {string} text1 First string.
		 * @param {string} text2 Second string.
		 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
		 *     An object containing the encoded text1, the encoded text2 and
		 *     the array of unique strings.
		 *     The zeroth element of the array of unique strings is intentionally blank.
		 * @private
		 */
		diff_linesToChars_(text1: string, text2: string): {
			chars1: string;
			chars2: string;
			lineArray: string[];
		};

		/**
		 * Rehydrate the text in a diff from a string of line hashes to real lines of
		 * text.
		 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
		 * @param {!Array.<string>} lineArray Array of unique strings.
		 * @private
		 */
		diff_charsToLines_(diffs: diff_match_patch.Diff[], lineArray: string[]): void;

		/**
		 * Determine the common prefix of two strings.
		 * @param {string} text1 First string.
		 * @param {string} text2 Second string.
		 * @return {number} The number of characters common to the start of each
		 *     string.
		 */
		diff_commonPrefix(text1: string, text2: string): number;

		/**
		 * Determine the common suffix of two strings.
		 * @param {string} text1 First string.
		 * @param {string} text2 Second string.
		 * @return {number} The number of characters common to the end of each string.
		 */
		diff_commonSuffix(text1: string, text2: string): number;		

		/**
		 * Determine if the suffix of one string is the prefix of another.
		 * @param {string} text1 First string.
		 * @param {string} text2 Second string.
		 * @return {number} The number of characters common to the end of the first
		 *     string and the start of the second string.
		 * @private
		 */
		diff_commonOverlap_(text1: string, text2: string): number;

		/**
		 * Do the two texts share a substring which is at least half the length of the
		 * longer text?
		 * This speedup can produce non-minimal diffs.
		 * @param {string} text1 First string.
		 * @param {string} text2 Second string.
		 * @return {Array.<string>} Five element Array, containing the prefix of
		 *     text1, the suffix of text1, the prefix of text2, the suffix of
		 *     text2 and the common middle.  Or null if there was no match.
		 * @private
		 */
		diff_halfMatch_(text1: string, text2: string): string[];

		/**
		 * Reduce the number of edits by eliminating semantically trivial equalities.
		 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
		 */
		diff_cleanupSemantic(diffs: diff_match_patch.Diff[]): void;

		/**
		 * Look for single edits surrounded on both sides by equalities
		 * which can be shifted sideways to align the edit to a word boundary.
		 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
		 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
		 */
		diff_cleanupSemanticLossless(diffs: diff_match_patch.Diff[]): void;

		/**
		 * Reduce the number of edits by eliminating operationally trivial equalities.
		 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
		 */
		diff_cleanupEfficiency(diffs: diff_match_patch.Diff[]): void;

		/**
		 * Reorder and merge like edit sections.  Merge equalities.
		 * Any edit section can move as long as it doesn't cross an equality.
		 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
		 */
		diff_cleanupMerge(diffs: diff_match_patch.Diff[]): void;

		/**
		 * loc is a location in text1, compute and return the equivalent location in
		 * text2.
		 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
		 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
		 * @param {number} loc Location within text1.
		 * @return {number} Location within text2.
		 */
		diff_xIndex(diffs: diff_match_patch.Diff[], loc: number): number;

		/**
		 * Convert a diff array into a pretty HTML report.
		 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
		 * @return {string} HTML representation.
		 */
		diff_prettyHtml(diffs: diff_match_patch.Diff[]): string;

		/**
		 * Compute and return the source text (all equalities and deletions).
		 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
		 * @return {string} Source text.
		 */
		diff_text1(diffs: diff_match_patch.Diff[]): string;

		/**
		 * Compute and return the destination text (all equalities and insertions).
		 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
		 * @return {string} Destination text.
		 */
		diff_text2(diffs: diff_match_patch.Diff[]): string;

		/**
		 * Compute the Levenshtein distance; the number of inserted, deleted or
		 * substituted characters.
		 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
		 * @return {number} Number of changes.
		 */
		diff_levenshtein(diff: diff_match_patch.Diff[]): number;

		/**
		 * Crush the diff into an encoded string which describes the operations
		 * required to transform text1 into text2.
		 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
		 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
		 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
		 * @return {string} Delta text.
		 */
		diff_toDelta(diffs: diff_match_patch.Diff[]): string;

		/**
		 * Given the original text1, and an encoded string which describes the
		 * operations required to transform text1 into text2, compute the full diff.
		 * @param {string} text1 Source string for the diff.
		 * @param {string} delta Delta text.
		 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
		 * @throws {!Error} If invalid input.
		 */
		diff_fromDelta(text1: string, delta: string): diff_match_patch.Diff[];

		//  MATCH FUNCTIONS

		/**
		 * Locate the best instance of 'pattern' in 'text' near 'loc'.
		 * @param {string} text The text to search.
		 * @param {string} pattern The pattern to search for.
		 * @param {number} loc The location to search around.
		 * @return {number} Best match index or -1.
		 */
		match_main(text: string, pattern: string, loc: number): number;

		/**
		 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
		 * Bitap algorithm.
		 * @param {string} text The text to search.
		 * @param {string} pattern The pattern to search for.
		 * @param {number} loc The location to search around.
		 * @return {number} Best match index or -1.
		 * @private
		 */
		match_bitap_(text: string, pattern: string, loc: number): number;

		/**
		 * Initialise the alphabet for the Bitap algorithm.
		 * @param {string} pattern The text to encode.
		 * @return {!Object} Hash of character locations.
		 * @private
		 */
		match_alphabet_(pattern: string): {[char: string]: number};

		//  PATCH FUNCTIONS

		/**
		 * Increase the context until it is unique,
		 * but don't let the pattern expand beyond Match_MaxBits.
		 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
		 * @param {string} text Source text.
		 * @private
		 */
		patch_addContext_(patch: diff_match_patch.patch_obj, text: string): void;

		/**
		 * Compute a list of patches to turn text1 into text2.
		 * Use diffs if provided, otherwise compute it ourselves.
		 * There are four ways to call this function, depending on what data is
		 * available to the caller:
		 * Method 1:
		 * a = text1, b = text2
		 * Method 2:
		 * a = diffs
		 * Method 3 (optimal):
		 * a = text1, b = diffs
		 * Method 4 (deprecated, use method 3):
		 * a = text1, b = text2, c = diffs
		 *
		 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
		 * Array of diff tuples for text1 to text2 (method 2).
		 * @param {string|!Array.<!diff_match_patch.Diff>} opt_b text2 (methods 1,4) or
		 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
		 * @param {string|!Array.<!diff_match_patch.Diff>} opt_c Array of diff tuples
		 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
		 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
		 */
		patch_make(a: string, opt_b: string): diff_match_patch.patch_obj[];
		patch_make(a: diff_match_patch.Diff[]): diff_match_patch.patch_obj[];
		patch_make(a: string, opt_b: diff_match_patch.Diff[]): diff_match_patch.patch_obj[];
		patch_make(a: string, opt_b: string, opt_c: diff_match_patch.Diff[]): diff_match_patch.patch_obj[];

		/**
		 * Given an array of patches, return another array that is identical.
		 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
		 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
		 */
		patch_deepCopy(patches: diff_match_patch.patch_obj[]): diff_match_patch.patch_obj[];

		/**
		 * Merge a set of patches onto the text.  Return a patched text, as well
		 * as a list of true/false values indicating which patches were applied.
		 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
		 * @param {string} text Old text.
		 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
		 *      new text and an array of boolean values.
		 */
		 patch_apply(patches: diff_match_patch.patch_obj[], text: string): Array<string | boolean[]>;

		/**
		 * Add some padding on text start and end so that edges can match something.
		 * Intended to be called only from within patch_apply.
		 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
		 * @return {string} The padding string added to each side.
		 */
		patch_addPadding(patches: diff_match_patch.patch_obj[]): string;

		/**
		 * Look through the patches and break up any which are longer than the maximum
		 * limit of the match algorithm.
		 * Intended to be called only from within patch_apply.
		 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
		 */
		patch_splitMax(patches: diff_match_patch.patch_obj[]): void;

		/**
		 * Take a list of patches and return a textual representation.
		 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
		 * @return {string} Text representation of patches.
		 */
		patch_toText(patches: diff_match_patch.patch_obj[]): string;

		/**
		 * Parse a textual representation of patches and return a list of Patch objects.
		 * @param {string} textline Text representation of patches.
		 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
		 * @throws {!Error} If invalid input.
		 */
		patch_fromText(textline: string): diff_match_patch.patch_obj[];
	}

	export namespace diff_match_patch { // virtual nested class declaration
		/** Class representing one patch operation. */
		class patch_obj {
			diffs: Diff[];
			start1: number | null;
			start2: number | null;
			length1: number;
			length2: number;

			/**
			 * Emmulate GNU diff's format.
			 * Header: @@ -382,8 +481,9 @@
			 * Indicies are printed as 1-based, not 0-based.
			 * @return {string} The GNU diff string.
			 */
			toString(): string;
		}

		/** Diff tuple */
		interface Diff {
			/**
			 * Items
			 *
			 * [0]: operation: insert(1), delete(-1), equal(0) as numeric constant
			 * [1]: text as string
			 */
			[x: number]: number | string;
		}
	}

	export default diff_match_patch;
}
