import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

const ManageCoasters = () => {
  const { coaster, fetchCoasters } = useGlobalContext();
  const [coasters, setCoasters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCoaster, setEditingCoaster] = useState(null);

  // Fix 1: Initialize all form fields with empty strings instead of undefined
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    park: "",
    maker: "",
    height: "",
    length: "",
    speed: "",
    lift: "",
    inversions: "",
    openingYear: "",
    description: "",
    img: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setCoasters(coaster || []);
  }, [coaster]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      park: "",
      openingYear: "",
      maker: "",
      height: "",
      length: "",
      inversions: "",
      speed: "",
      lift: "",
      description: "",
      state: "",
      img: "",
    });
    setEditingCoaster(null);
  };

  const handleEdit = (coaster) => {
    setEditingCoaster(coaster.id);
    setFormData({
      title: coaster.title || "",
      category: coaster.category || "",
      park: coaster.park || "",
      openingYear: coaster.openingYear || "",
      maker: coaster.maker || "",
      height: coaster.height || "",
      length: coaster.length || "",
      inversions: coaster.inversions || "",
      speed: coaster.speed || "",
      lift: coaster.lift || "",
      description: coaster.description || "",
      img: coaster.img || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const apiUrl = editingCoaster
        ? `${API_URL}/rollercoasters/${editingCoaster}`
        : `${API_URL}/rollercoasters`;

      const method = editingCoaster ? "PUT" : "POST";

      const dataToSend = {
        title: formData.title,
        category: formData.category,
        park: formData.park || "",
        openingYear: formData.openingYear ? Number(formData.openingYear) : null,
        maker: formData.maker || "",
        height: formData.height ? Number(formData.height) : null,
        length: formData.length ? Number(formData.length) : null,
        inversions: formData.inversions ? Number(formData.inversions) : null,
        speed: formData.speed ? Number(formData.speed) : null,
        lift: formData.lift || "",
        state: "Operativo",
        description: formData.description || "",
        img: formData.img || "",
      };

      console.log("mando dati alla api (senza wrapper):", dataToSend);
      console.log("api url", apiUrl);

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        // Get the full error response text
        const errorText = await response.text();
        console.log("Error response text:", errorText);

        try {
          // Try to parse as JSON if possible
          const errorData = JSON.parse(errorText);
          throw new Error(
            errorData?.message ||
              errorData?.error ||
              `Error ${response.status}: ${response.statusText}`
          );
        } catch (parseError) {
          // If not JSON, use the raw text
          throw new Error(
            `Error ${response.status}: ${response.statusText} - ${errorText}`
          );
        }
      }

      //aggiorno lista
      await fetchCoasters();
      resetForm();
    } catch (err) {
      setError(err.message);
      console.error("Error submitting form:", err);
    } finally {
      setIsLoading(false);
    }
  };

  //logica di cancellazione record
  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo coaster??")) {
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/rollercoasters/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      await fetchCoasters();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-luckiest text-center mb-8">
        Gestisci Coasters
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-luckiest mb-4">
            {editingCoaster ? "Modifica Coaster" : "Aggiungi Nuovo Coaster"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">Titolo *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Categoria *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Parco</label>
                <input
                  type="text"
                  name="park"
                  value={formData.park}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Produttore</label>
                <input
                  type="text"
                  name="maker"
                  value={formData.maker}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Altezza (m)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Lunghezza (m)
                </label>
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Velocità (km/h)
                </label>
                <input
                  type="number"
                  name="speed"
                  value={formData.speed}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Tipo di Lift</label>
                <input
                  type="text"
                  name="lift"
                  value={formData.lift}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Inversioni</label>
                <input
                  type="number"
                  name="inversions"
                  value={formData.inversions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Anno</label>
                <input
                  type="number"
                  name="openingYear"
                  value={formData.openingYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Immagine</label>
                <input
                  type="text"
                  name="img"
                  value={formData.img}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Nome file immagine"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Descrizione</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                rows="4"
              ></textarea>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-orange-500 text-black font-luckiest px-4 py-2 rounded hover:bg-orange-600 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-1"
                disabled={isLoading}
              >
                {isLoading
                  ? "Salvataggio..."
                  : editingCoaster
                  ? "Aggiorna"
                  : "Aggiungi"}
              </button>

              {editingCoaster && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white font-luckiest px-4 py-2 rounded hover:bg-gray-600 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-1"
                >
                  Annulla
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-luckiest mb-4">Coasters Esistenti</h2>

          {coasters.length === 0 ? (
            <p className="text-gray-500">Nessun coaster disponibile.</p>
          ) : (
            <div className="overflow-auto max-h-[600px]">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Titolo</th>
                    <th className="py-2 px-4 text-left">Categoria</th>
                    <th className="py-2 px-4 text-left">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {coasters.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-4">{item.title}</td>
                      <td className="py-2 px-4">{item.category}</td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Modifica
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                          >
                            Elimina
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCoasters;
