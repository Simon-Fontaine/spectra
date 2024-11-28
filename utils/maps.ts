export async function getMapIdByName(supabase: any, name: string) {
  const normalizedName = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const { data, error } = await supabase
    .from("maps")
    .select("id")
    .ilike("name", normalizedName)
    .single();

  if (error) {
    throw new Error(`Map not found: ${normalizedName}`);
  }

  return data.id;
}
