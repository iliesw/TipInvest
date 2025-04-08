import useFetch from "../fetch";

interface ExpertProfile {
  id?: string;
  name?: string;
  email?: string;
  bio?: string;
  expertise?: string[];
  profilePictureUrl?: string;
  // Add other relevant fields as needed
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function uploadProfilePicture(
  base64Image: string,
): Promise<{ profilePictureUrl: string }> {
  const response = await useFetch.post(
    `/expert/profile/upload-picture`,
    {image:JSON.stringify({ image: base64Image })}
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload profile picture");
  }

  return response.json();
}

export async function updateExpertProfile(
  profile: Partial<ExpertProfile>,
  token: string
): Promise<{ profile: ExpertProfile }> {
  const response = await fetch(`${API_URL}/expert/profile`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update profile");
  }

  return response.json();
}
