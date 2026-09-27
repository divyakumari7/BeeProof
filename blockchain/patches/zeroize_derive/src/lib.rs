use proc_macro::TokenStream;

#[proc_macro_derive(Zeroize, attributes(zeroize))]
pub fn derive_zeroize(_input: TokenStream) -> TokenStream {
    TokenStream::new()
}
